package com.yume.controllers;

import java.util.List;

import com.yume.models.GrupoModel;
import com.yume.models.UsuarioLogin;
import com.yume.models.UsuarioModel;
import com.yume.services.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService service;

    @PostMapping("/logar")
    public ResponseEntity<UsuarioLogin> logar(@RequestBody UsuarioLogin usuarioLogin) {
        return service.logar(usuarioLogin);
    }

    @GetMapping("/usuario")
    public ResponseEntity<List<UsuarioModel>> pegarTodosUsuarios() {
        return service.pegarTodosUsuarios();
    }

    @GetMapping("/usuario/{email}")
    public ResponseEntity<UsuarioModel> pegarUsuarioPorEmail(String email) {
        return service.pegarUsuarioPorEmail(email);
    }

    @PutMapping("/usuario")
    public ResponseEntity<UsuarioModel> atualizarUsuario(@RequestBody UsuarioModel usuario) {
        return service.atualizarUsuario(usuario);
    }
    
    @PutMapping("/grupo/{token}/incluir/{email}")
    public ResponseEntity<UsuarioModel> incluirUsuarioNoGrupo(String email, String token) {
        return service.incluirUsuarioNoGrupo(email, token);
    }

    @PutMapping("/grupo/retirar/{email}")
    public ResponseEntity<UsuarioModel> retirarUsuarioDoGrupo(String email) {
        return service.retirarUsuarioDoGrupo(email);
    }

    @PutMapping("/usuario/desativar/{email}")
    public ResponseEntity<UsuarioModel> desativarUsuario(String email) {
        return service.desativarUsuario(email);
    }

    @PutMapping("/usuario/ativar/{email}")
    public ResponseEntity<UsuarioModel> ativarUsuario(String email) {
        return service.ativarUsuario(email);
    }

    @DeleteMapping("/usuario/excluir")
    public void excluirUsuario(long id) {
        service.excluirUsuario(id);
    }

    @GetMapping("/grupo")
    public ResponseEntity<List<GrupoModel>> pegarTodosGrupos() {
        return service.pegarTodosGrupos();
    }

    @GetMapping("/grupo/{token}")
    public ResponseEntity<GrupoModel> pegarGrupoPorToken(String token) {
        return service.pegarGrupoPorToken(token);
    }

    @PutMapping("/grupo")
    public ResponseEntity<GrupoModel> atualizarGrupo(GrupoModel grupo) {
        return service.atualizarGrupo(grupo);
    }

    @PutMapping("/grupo/desativar/{token}")
    public ResponseEntity<GrupoModel> desativarGrupo(String token) {
        return service.desativarGrupo(token);
    }

    @PutMapping("/grupo/ativar/{token}")
    public ResponseEntity<GrupoModel> ativarGrupo(String token) {
        return service.ativarGrupo(token);
    }

    @DeleteMapping("/grupo")
    public void apagarGrupo(long id) {
        service.excluirGrupo(id);
    }
}