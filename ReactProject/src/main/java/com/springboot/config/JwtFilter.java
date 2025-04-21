package com.springboot.config;

import com.springboot.service.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private CustomUserDetailsService userServce;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        try{
            
            String authHeader = request.getHeader("Authorization");
        
            String token = null;

            String username = null;

            if(authHeader != null && authHeader.startsWith("Bearer ")){

                token = authHeader.substring(7);

                username = jwtService.extractUsername(token);

            }

            if(username != null && SecurityContextHolder.getContext().getAuthentication() == null ){
                CustomUser user = (CustomUser) userServce.loadUserByUsername(username);

                Boolean validateToken = jwtService.validateToken(token, user);

                if(validateToken){

                    UsernamePasswordAuthenticationToken authenticationToken =
                                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken); 


                }


            }

            filterChain.doFilter(request, response);
            
        } catch(ExpiredJwtException e){
            
            System.out.println("Token Expired: " + e.getMessage());
        }
        
    }
    
}
