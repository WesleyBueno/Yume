package com.yume.repositories;

import com.yume.models.UsuarioModel;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {

    UsuarioModel findByEmail(String email);

    UsuarioModel findByToken(String token);
}
