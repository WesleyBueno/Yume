package com.yume.services;

import java.nio.charset.Charset;
import java.util.List;

import com.yume.models.GrupoModel;
import com.yume.models.UsuarioLogin;
import com.yume.models.UsuarioModel;
import com.yume.repositories.GrupoRepository;
import com.yume.repositories.UsuarioRepository;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
	private EmailService emailService;

    public ResponseEntity<UsuarioLogin> logar(UsuarioLogin usuarioLogin) {

        UsuarioModel usuario = usuarioRepository.findByEmail(usuarioLogin.getEmail());

        if (usuario == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        if (!encoder.matches(usuarioLogin.getSenha(), usuario.getSenha()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        String auth = usuarioLogin.getEmail() + ":" + usuarioLogin.getSenha();
        byte[] authEncoded = Base64.encodeBase64(auth.getBytes(Charset.forName("US-ASCII")));
        String authHeader = "Basic " + new String(authEncoded);
        usuarioLogin.setToken(authHeader);

        usuarioLogin.setEmail("");
        usuarioLogin.setSenha("");
        
        return ResponseEntity.status(HttpStatus.OK).body(usuarioLogin);
    }

    public ResponseEntity<List<UsuarioModel>> pegarTodosUsuarios() {
        List<UsuarioModel> usuarios = usuarioRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(usuarios);
    }

    public ResponseEntity<UsuarioModel> pegarUsuarioPorEmail(String email) {
        UsuarioModel usuario = usuarioRepository.findByEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(usuario);
    }

    public ResponseEntity<UsuarioModel> atualizarUsuario(UsuarioModel usuario) {
        usuario = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.OK).body(usuario);
    }
    
    public ResponseEntity<UsuarioModel> incluirUsuarioNoGrupo(String email, String token) {
        UsuarioModel usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        GrupoModel grupo = grupoRepository.findByToken(token);
        if (grupo == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        if (grupo.isAtivo()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

        usuario.setGrupo(grupo);
        usuario = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.OK).body(usuario);
    }

    public ResponseEntity<UsuarioModel> retirarUsuarioDoGrupo(String email) {
        UsuarioModel usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        usuario.setGrupo(null);
        usuario = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.OK).body(usuario);
    }

    public ResponseEntity<UsuarioModel> desativarUsuario(String email) {
        UsuarioModel usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.OK).body(usuario);
    }

    public ResponseEntity<UsuarioModel> ativarUsuario(String email) {
        UsuarioModel usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        usuario.setAtivo(true);
        usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.OK).body(usuario);
    }

    public void excluirUsuario(long id) {
        usuarioRepository.deleteById(id);
    }

    public ResponseEntity<List<GrupoModel>> pegarTodosGrupos() {
        List<GrupoModel> grupos = grupoRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(grupos);
    }

    public ResponseEntity<GrupoModel> pegarGrupoPorToken(String token) {
        GrupoModel grupo = grupoRepository.findByToken(token);
        return ResponseEntity.status(HttpStatus.OK).body(grupo);
    }

    public ResponseEntity<GrupoModel> atualizarGrupo(GrupoModel grupo) {
        grupo = grupoRepository.save(grupo);
        return ResponseEntity.status(HttpStatus.OK).body(grupo);
    }

    public ResponseEntity<GrupoModel> desativarGrupo(String token) {
        GrupoModel grupo = grupoRepository.findByToken(token);
        if (grupo == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        
        grupo.setAtivo(false);
        grupoRepository.save(grupo);
        return ResponseEntity.status(HttpStatus.OK).body(grupo);
    }

    public ResponseEntity<GrupoModel> ativarGrupo(String token) {
        GrupoModel grupo = grupoRepository.findByToken(token);
        if (grupo == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        
        grupo.setAtivo(true);
        grupoRepository.save(grupo);
        return ResponseEntity.status(HttpStatus.OK).body(grupo);
    }

    public void excluirGrupo(long id) {
        grupoRepository.deleteById(id);
    }
}
