package com.yume.repositories;

import com.yume.models.GrupoModel;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GrupoRepository extends JpaRepository<GrupoModel, Long> {

    GrupoModel findByNome(String nome);
    
    GrupoModel findByToken(String token);
}
