package com.yume.security;

import com.yume.models.UsuarioModel;
import com.yume.repositories.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    
        UsuarioModel usuario = repository.findByEmail(email);
		
		if (usuario == null)
			throw new UsernameNotFoundException("Usuário com email " + email + "não encontrado.");
		
		return new UserDetailsImpl(usuario);
    }

}
