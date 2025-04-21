package com.springboot.JsonResponse;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CartResponse {
    
    private int id;
     
    private Date date;
     
    private int purchaseQty;
    
    private long purchaseAmt;
    
    private int userId;
    
    private int categoryId;
    
    private int productId;
    
    private ProductResponse product;
    
}
