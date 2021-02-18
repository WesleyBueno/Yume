package com.yume.controllers;

import javax.validation.Valid;

import com.yume.models.GrupoModel;
import com.yume.models.ResponseMessage;
import com.yume.models.UsuarioModel;
import com.yume.services.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/usuario/cadastrar")
    public ResponseEntity<ResponseMessage> cadastrar(@RequestBody UsuarioModel usuario) {
        return service.cadastrar(usuario);
    }

    @GetMapping("/usuario/verificar")
    public ResponseEntity<ResponseMessage> ativarUsuario(@RequestParam String token) {
        return service.ativarUsuario(token);
    }

    @PostMapping("/grupo/criar")
    public ResponseEntity<ResponseMessage> criarGrupo(@RequestBody GrupoModel grupo) {
        return service.criarGrupo(grupo);
    }

    @PostMapping("/grupo/convidar")
    public ResponseEntity<ResponseMessage> convidar(@RequestBody GrupoModel grupo) {
        return service.convidar(grupo);
    }

    @GetMapping("/grupo/convite")
    public ResponseEntity<ResponseMessage> aceitarConvite(@RequestParam String token, @RequestParam String codigo) {
        return service.aceitarConvite(token, codigo);
    }
}
