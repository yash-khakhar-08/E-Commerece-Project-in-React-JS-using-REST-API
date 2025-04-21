/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.springboot.JsonResponse;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class OrderResponse {
    
    private int id;
    
    private Date date;
    
    private ProductResponse product;
    
    private int purchaseQty;
    
    private long purchaseAmt;
    
    private String status;
    
    private String paymentMode;
    
}
