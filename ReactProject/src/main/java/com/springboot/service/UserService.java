/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.springboot.service;

import com.springboot.JsonResponse.AddressResponse;
import com.springboot.JsonResponse.UserResponse;
import com.springboot.models.Address;
import com.springboot.models.User;
import com.springboot.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 *
 * @author Yash
 */

@Service
public class UserService {
    
    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private AuthenticationManager authManager;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private AddressService addressService;
    
    public User save(UserResponse userResponse){
        
        userResponse.setRole("ROLE_USER");
        
        userResponse.setPassword(new BCryptPasswordEncoder().encode(userResponse.getPassword()));
        
        if(getByEmail(userResponse.getEmail()) == null) {
            User user = User.builder().email(userResponse.getEmail()).fullName(userResponse.getFullName()).
                gender(userResponse.getGender()).mobileNo(userResponse.getMobileNo()).password(userResponse.getPassword())
                .role(userResponse.getRole()).build();
            
            return userRepo.save(user);
            
        }
        
        return null;
        
    }
    
    public boolean isUserExists(String email){
        
        User user = userRepo.findByEmail(email);
        return user != null;
        
    }
    
    public User getUserById(int id){
        
        User user = userRepo.findById(id).get();
        if(user != null)
            return user;    
        else
            return null;
        
    }
    
    public User updateUser(User user){
        return userRepo.save(user);
    }
    
    public boolean updateAddress(AddressResponse addressResponse){
        
        try{
            
            User user = getUserById(addressResponse.getUserId());
            if(user != null){

                if(user.getAddress() != null) {
                    
                    Address address = user.getAddress();
                    address.setBlockNo(addressResponse.getBlockNo());
                    address.setApartmentName(addressResponse.getApartmentName());
                    address.setCity(addressResponse.getCity());
                    address.setState(addressResponse.getState());
                    address.setPinCode(addressResponse.getPinCode());
                    address.setCountry(addressResponse.getCountry());
                    user.setAddress(address);
                    
                    userRepo.save(user);
                    
                    
                } else{
                    
                    Address address = new Address();
                    address.setBlockNo(addressResponse.getBlockNo());
                    address.setApartmentName(addressResponse.getApartmentName());
                    address.setCity(addressResponse.getCity());
                    address.setState(addressResponse.getState());
                    address.setPinCode(addressResponse.getPinCode());
                    address.setCountry(addressResponse.getCountry());

                    user.setAddress(addressService.saveAddress(address));

                    userRepo.save(user);
                    
                }
                
                return true;

            }
            
            
        } catch(Exception e){
            System.out.println(e);
            
        }
        
        return false;
        
    }
    
    public User getByEmail(String email){
        
        try{
            
            User user = userRepo.findByEmail(email);
            
            if(user != null)
                return user;
            else
                return null;
            
        }catch(Exception e){
            return null;
        }
        
    }
    
    public UserResponse login(UserResponse userResponse){
        
        System.out.println("authentication manager");
        
        Authentication auth =  authManager.authenticate(new UsernamePasswordAuthenticationToken(userResponse.getEmail(),userResponse.getPassword()));
        
        if(auth.isAuthenticated()){
            
            String token = jwtService.generateToken(userResponse.getEmail());
            userResponse.setJwtToken(token);
            
            User user = userRepo.findByEmail(userResponse.getEmail());
            user.setJwtToken(token);
            
            if(user.getAddress() != null) {
                String address = user.getAddress().getBlockNo() + ", " + user.getAddress().getApartmentName() + ", " + user.getAddress().getCity()
                    + ", " + user.getAddress().getState() + ", " + user.getAddress().getPinCode() + ", " + user.getAddress().getCountry();
                
                userResponse.setAddress(address);
                
            }
            
            
            userResponse.setFullName(user.getFullName());
            userResponse.setGender(user.getGender());
            userResponse.setId(user.getId());
            userResponse.setMobileNo(userResponse.getMobileNo());
            userResponse.setPassword("");
            
            
            updateUser(user);
            
            return userResponse;
            
        }
        
        return null;
        
    }
    
    
}
