/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.springboot.config;

import com.springboot.models.User;
import java.util.Arrays;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 *
 * @author Yash
 */
public class CustomUser implements UserDetails  {
    
    private User user;

    public CustomUser(User user) {
        System.out.println("CustomUser obj created");
        this.user = user;
    }
    
    

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());
        return Arrays.asList(authority);
        
        
    }

    @Override
    public String getPassword() {
        
        return user.getPassword();
        
    }

    @Override
    public String getUsername() {
        
        return user.getEmail();
        
    }
    
}
