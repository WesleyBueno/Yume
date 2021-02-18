package com.yume.models;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="grupos")
public class GrupoModel {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;

    @Column(unique=true)
    @NotEmpty
    private String nome;

    @OneToMany(mappedBy="grupo", cascade=CascadeType.ALL)
    @JsonIgnoreProperties(value="grupo", allowSetters=true)
    private List<UsuarioModel> integrantes;

    private boolean ativo;

    @Column(unique=true)
    private String token;

    public long getId() {
        return this.id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<UsuarioModel> getIntegrantes() {
        return this.integrantes;
    }

    public void setIntegrantes(List<UsuarioModel> integrantes) {
        this.integrantes = integrantes;
    }

    public boolean isAtivo() {
        return this.ativo;
    }

    public boolean getAtivo() {
        return this.ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

}
