package com.yume.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.yume.models.UsuarioModel;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserDetailsImpl implements UserDetails {

    private static final long serialVersionUID = 1L;

    private String username;
	private String password;
	private boolean activated;
	private List<GrantedAuthority> authorities;

    public UserDetailsImpl() {}
	
	public UserDetailsImpl(UsuarioModel usuario) {
		
		this.username = usuario.getEmail();
		this.password = usuario.getSenha();
		this.activated = usuario.isAtivo();
		
		List<GrantedAuthority> role = new ArrayList<>();
		role.add(new SimpleGrantedAuthority(usuario.getRole()));
		this.authorities = role;
	}

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.activated;
    }

}
