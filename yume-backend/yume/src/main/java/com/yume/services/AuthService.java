package com.yume.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.validation.ConstraintViolationException;

import com.yume.models.GrupoModel;
import com.yume.models.ResponseMessage;
import com.yume.models.UsuarioModel;
import com.yume.repositories.GrupoRepository;
import com.yume.repositories.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

	final int MAXIMO_INTEGRANTES = 3;

	@Autowired
	private UsuarioRepository usuarioRepository;
	
	@Autowired
	private GrupoRepository grupoRepository;
	
	@Autowired
	private EmailService emailService;

    public ResponseEntity<ResponseMessage> cadastrar(UsuarioModel usuario) {
		
        UsuarioModel usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());

        if (usuarioExistente != null)
			return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseMessage("UK_EMAIL", "Usuário já existe"));

		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		
		//Senha default para usuarios comuns
		String senha = (usuario.getSenha() == null || usuario.getSenha().equals("")) ? "default" : usuario.getSenha();
		usuario.setSenha(senha);
		String senhaCriptografada = encoder.encode(usuario.getSenha());
		usuario.setSenha(senhaCriptografada);

		usuario.setAtivo(false);
		
        usuario.setRole("ROLE_USER");
        
        String tokenVerificacao = UUID.randomUUID().toString().replace("-", "");
		usuario.setToken(tokenVerificacao);

		try {
			usuarioRepository.save(usuario);
		} catch (ConstraintViolationException excecao) {
			String propriedade = excecao.getConstraintViolations().iterator().next().getPropertyPath().toString();
			
			if (propriedade.equals("cpf"))
				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(new ResponseMessage("INVALID_CPF", "CPF inválido"));
			
			if (propriedade.equals("email"))
				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(new ResponseMessage("INVALID_EMAIL", "Email inválido"));
		}

		String linkVerificacao = "http://localhost:8080/auth/usuario/verificar?token=" + tokenVerificacao;
		String body = "Clique <a href=\"" + linkVerificacao + "\">aqui</a> para verificar sua conta";

		emailService.enviarToken(usuario.getEmail(), "Link para verificação de conta", body);

		return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseMessage("OK", "Verifique seu email e clique no link enviado para ativar sua conta"));
	}

	public ResponseEntity<ResponseMessage> ativarUsuario(String token) {

		UsuarioModel usuario = usuarioRepository.findByToken(token);

		if (usuario == null)
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("INVALID_TOKEN", "Token inválido"));

		usuario.setAtivo(true);
		usuario.setToken("");
		usuarioRepository.save(usuario);

		return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("OK", "Usuário ativado"));
	}

	public ResponseEntity<ResponseMessage> criarGrupo(GrupoModel grupo) {

		GrupoModel grupoExistente = grupoRepository.findByNome(grupo.getNome());

		if (grupoExistente != null)
			return ResponseEntity.status(HttpStatus.CONFLICT).body(new ResponseMessage("UK_GROUP", "Grupo com nome: " + grupo.getNome() + " já existe"));

		UsuarioModel representante;
		if (grupo.getIntegrantes() != null && grupo.getIntegrantes().size() > 0)
			representante = usuarioRepository.findByEmail(grupo.getIntegrantes().get(0).getEmail());
		else
			return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(new ResponseMessage("INVALID_EMAIL", "Email do representante não informado"));

		if (representante == null)
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("INVALID_USER", "Usuário não cadastrado"));

		if (!representante.isAtivo())
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ResponseMessage("INVALID_USER", "Usuário não ativo"));

		if (representante.getGrupo() != null)
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ResponseMessage("INVALID_USER", "Usuário já possui um grupo"));

		String tokenIdentificacao = UUID.randomUUID().toString().replace("-", "");
		grupo.setToken(tokenIdentificacao);

		grupo.setAtivo(false);

		List<UsuarioModel> integrantes = new ArrayList<UsuarioModel>();
		integrantes.add(representante);
		grupo.setIntegrantes(integrantes);
		
		grupo = grupoRepository.save(grupo);
		
		representante.setGrupo(grupo);
		usuarioRepository.save(representante);

		String body = "Grupo " + grupo.getNome() + " criado com sucesso!<br>Este é o código do grupo para os convidar outros participantes: <strong>" + tokenIdentificacao + "</strong>";
		emailService.enviarToken(representante.getEmail(), "Código do Grupo", body);

		return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseMessage("OK", "Este código será usado para identificar o grupo: " + tokenIdentificacao));
	}

	public ResponseEntity<ResponseMessage> convidar(GrupoModel grupo) {

		GrupoModel grupoExistente = grupoRepository.findByToken(grupo.getToken());

		if (grupoExistente == null)
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("INVALID_GROUP", "Grupo não existe"));

		if (grupoExistente.isAtivo())
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseMessage("INVALID_GROUP", "Grupo completo"));

		if (grupoExistente.getIntegrantes().size() + grupo.getIntegrantes().size() > MAXIMO_INTEGRANTES)
			return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(new ResponseMessage("INVALID_GROUP", "Número de convidados excede limite de integrantes por grupo"));

		String tokenVerificacao, linkVerificacao, body;
		for (UsuarioModel usuario : grupo.getIntegrantes()) {
	
			usuario = usuarioRepository.findByEmail(usuario.getEmail());

			if (usuario == null || !usuario.isAtivo() || usuario.getGrupo() != null) continue;

			tokenVerificacao = UUID.randomUUID().toString().replace("-", "");
			usuario.setToken(tokenVerificacao);
	
			linkVerificacao = "http://localhost:8080/auth/grupo/convite?token=" + tokenVerificacao + "&codigo=" + grupoExistente.getToken();
			body = "Você foi convidado para o grupo " + grupoExistente.getNome() + ".<br>Clique <a href=\"" + linkVerificacao + "\">aqui</a> para entrar no grupo.";
			
			emailService.enviarToken(usuario.getEmail(), "Convite para entrar no grupo", body);			
	
			usuarioRepository.save(usuario);
		}

		return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("OK", "Convites enviados"));
	}	

	public ResponseEntity<ResponseMessage> aceitarConvite(String token, String codigo) {

		GrupoModel grupo = grupoRepository.findByToken(codigo);

		if (grupo == null)
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("INVALID_TOKEN", "Token inválido"));

		if (grupo.isAtivo()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseMessage("INVALID_GROUP", "Grupo completo"));

		UsuarioModel usuario = usuarioRepository.findByToken(token);

		if (usuario == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("INVALID_TOKEN", "Token inválido"));
		
		usuario.setGrupo(grupo);
		usuario.setToken("");
		usuarioRepository.save(usuario);

		if (grupo.getIntegrantes().size() == MAXIMO_INTEGRANTES) {
			grupo.setAtivo(true);
			grupoRepository.save(grupo);
		}

		return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("OK", "Convite aceito"));
	}

}
