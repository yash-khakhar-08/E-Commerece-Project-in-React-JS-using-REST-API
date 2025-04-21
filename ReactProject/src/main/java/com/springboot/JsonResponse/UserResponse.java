package com.springboot.JsonResponse;

import com.springboot.models.CartInfo;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserResponse {
    
    private int id;
    
    private String fullName;
    
    private String email;
    
    private String password;
    
    private String role;
    
    private String gender;
    
    private String mobileNo;
    
    private String address;
    
    private String jwtToken;
    
}
