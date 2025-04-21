package com.springboot.controller;

import com.springboot.JsonResponse.AddressResponse;
import com.springboot.JsonResponse.CartResponse;
import com.springboot.JsonResponse.CategoryResponse;
import com.springboot.JsonResponse.OrderResponse;
import com.springboot.JsonResponse.UserResponse;
import com.springboot.models.User;
import com.springboot.service.CartInfoService;
import com.springboot.service.CategoryService;
import com.springboot.service.CustomFunctions;
import com.springboot.service.JwtService;
import com.springboot.service.OrdersService;
import com.springboot.service.ProductService;
import com.springboot.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    
    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CartInfoService cartInfoService;
    
    @Autowired
    private OrdersService orderService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private JwtService jwtService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserResponse userResponse){
        
         try {
            UserResponse userRes = userService.login(userResponse);
            
            if(userRes == null){
            
                return new ResponseEntity<>("Bad Credentials ",HttpStatus.BAD_REQUEST);
            } 
        
            return new ResponseEntity<>(userRes,HttpStatus.OK);
        } catch(Exception e){
            
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        
        
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserResponse userResponse){
        
         try {
        
             User user = userService.save(userResponse);
             if(user != null){
                 return new ResponseEntity<>("Account Created",HttpStatus.OK);
             }else{
                 return new ResponseEntity<>("Account Creation failed",HttpStatus.INTERNAL_SERVER_ERROR);
             }
        } catch(Exception e){
            
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
         
    }
    
    @PostMapping("/user/saveAddress")
    public ResponseEntity<?> saveUserAddress(@RequestBody AddressResponse addressResponse){
        
        boolean isAddressUpdates = userService.updateAddress(addressResponse);
        if(isAddressUpdates) {
            return new ResponseEntity<>("address updated",HttpStatus.OK);
        }
        
        return new ResponseEntity<>("address not updated",HttpStatus.INTERNAL_SERVER_ERROR);
        
    }
    
    @PostMapping("/getProducts")
    public ResponseEntity<?> getProducts(@RequestBody Map<String,String> data ){
        
        // for display products in home, men, women section
        
        List<CategoryResponse> category =  categoryService.getAllCategoryWithRandomProducts(data.get("sectionName"));
        
        
        if(ObjectUtils.isEmpty(category)){
            
            return new ResponseEntity<>("No Products available at moment!",HttpStatus.NOT_FOUND);
            
        } 
        
        return new ResponseEntity<>(category,HttpStatus.OK);
        
    }
    
    @PostMapping("/getRelatedProducts")
    public ResponseEntity<?> getRelatedProducts(@RequestBody Map<String,Integer> data ){
        
        // for display related products under product item section
        
        CategoryResponse category =  categoryService.getRelatedProductsByCategoryId(data.get("id"),data.get("productId"));
        
        if(category == null){
            
            return new ResponseEntity<>("No Related Products available at moment!",HttpStatus.NOT_FOUND);
            
        } 
        
        return new ResponseEntity<>(category,HttpStatus.OK);
        
    }
    
    @GetMapping("/getCategories")
    public ResponseEntity<?> getCategories(){
        
        // for displaying category in navbar
        
        List<CategoryResponse> category =  categoryService.getCategoryIfProduct();
        
        
        if(ObjectUtils.isEmpty(category)){
            
            return new ResponseEntity<>("Something went wrong",HttpStatus.INTERNAL_SERVER_ERROR);
            
        } 
        
        return new ResponseEntity<>(category,HttpStatus.OK);
        
    }
    
    @PostMapping("/user/addToCart")
    public ResponseEntity<?> addToCart(@RequestBody CartResponse cartResponse){
        
        boolean isAddedInCart = cartInfoService.addToCart(cartResponse);
        if(isAddedInCart){
             return new ResponseEntity<>("Added to cart",HttpStatus.OK);
        } else{
            return new ResponseEntity<>("Add to cart failed",HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }
    
    @PostMapping("/user/updateCart")
    public ResponseEntity<?> updateCart(@RequestBody CartResponse cartResponse){
        
        System.out.println(cartResponse);
        
        boolean cartUpdated = cartInfoService.updateCart(cartResponse);
        if(cartUpdated){
             return new ResponseEntity<>("Cart Updated",HttpStatus.OK);
        } else{
            return new ResponseEntity<>("Cart update failed",HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }
    
    @PostMapping("/user/deleteFromCart")
    public ResponseEntity<?> deleteFromCart(@RequestBody Map<String,Integer> data){
        
        boolean isRemoved = cartInfoService.removeFromCart(data.get("cartId"));
        if(isRemoved){
             return new ResponseEntity<>("Item removed from cart",HttpStatus.OK);
        } else{
            return new ResponseEntity<>("Cart update failed",HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }
    
    @PostMapping("/user/getProductIds")
    public ResponseEntity<?> getProductIds(@RequestBody Map<String,Integer> data){
        
        try{
            
            User user = userService.getUserById(data.get("id"));
            if(user != null){

                String token = user.getJwtToken();
                if(jwtService.isTokenExpired(token)){
                    System.out.println("Token came");
                    return new ResponseEntity<>("token expired",HttpStatus.BAD_REQUEST);
                }

                List<Integer> productsIds = cartInfoService.getCartItemByUserId(data.get("id"));

                if(productsIds != null) {
                    return new ResponseEntity<>(productsIds,HttpStatus.OK);
                } else{
                    return new ResponseEntity<>("no products added to cart",HttpStatus.NO_CONTENT);
                }

            } else{
                return new ResponseEntity<>("no user found",HttpStatus.BAD_REQUEST);
            }
            
        }catch(ExpiredJwtException e){
            System.out.println("Product id called:");
            return new ResponseEntity<>("token expired",HttpStatus.BAD_REQUEST);
        }
        
    }
    
    @PostMapping("/user/getCartCount")
    public ResponseEntity<?> getCartCount(@RequestBody Map<String,Integer> data){
        
        try{
            
            User user = userService.getUserById(data.get("id"));
            if(user != null){

                String token = user.getJwtToken();
                if(jwtService.isTokenExpired(token)){
                    System.out.println("Token expired");
                    return new ResponseEntity<>("token expired",HttpStatus.BAD_REQUEST);
                }

                List<Integer> productsIds = cartInfoService.getCartItemByUserId(data.get("id"));

                if(productsIds != null && !ObjectUtils.isEmpty(productsIds)) {
                    return new ResponseEntity<>(productsIds.size(),HttpStatus.OK);
                } else{
                    return new ResponseEntity<>("no products added to cart",HttpStatus.NO_CONTENT);
                }

            } else{
                return new ResponseEntity<>("token expired",HttpStatus.BAD_REQUEST);
            }
            
        } catch(ExpiredJwtException e){
            System.out.println("cart count called:");
            return new ResponseEntity<>("token expired",HttpStatus.BAD_REQUEST);
        }
         
    }
    
    @PostMapping("/user/getAllCartItems")
    public ResponseEntity<?> getAllCartItems(@RequestBody Map<String,Integer> data){
        
        List<CartResponse> cartResponse = cartInfoService.getAllCartItems(data.get("id"));
        
        if(cartResponse != null) {
            return new ResponseEntity<>(cartResponse,HttpStatus.OK);
        } else{
            return new ResponseEntity<>("no products added to cart",HttpStatus.NO_CONTENT);
        }
         
    }
    
    @PostMapping("/user/placeOrder")
    public ResponseEntity<?> placeOrder(@RequestBody Map<String,String> data) {
        
        boolean isOrderPlaced = orderService.saveOrder(Integer.parseInt(data.get("userId")), data.get("paymentMode"));
        
        if(isOrderPlaced){
            return new ResponseEntity<>("Order Placed",HttpStatus.OK); 
        }
        
        return new ResponseEntity<>("Order did not Placed",HttpStatus.INTERNAL_SERVER_ERROR); 
        
    }
    
    @PostMapping("/user/getAllOrders")
    public ResponseEntity<?> getAllOrders(@RequestBody Map<String,Integer> data) {
        
        List<OrderResponse> orderResponses = orderService.getOrders(data.get("userId"));
        
        if(orderResponses != null && !ObjectUtils.isEmpty(orderResponses)){
            return new ResponseEntity<>(orderResponses,HttpStatus.OK); 
        }
        
        return new ResponseEntity<>("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR); 
        
    }
    
    @PostMapping("/user/canelOrder")
    public ResponseEntity<?> canelOrder(@RequestBody Map<String,Integer> data) {
        
        boolean isOrderCanceled = orderService.cancelOrder(data.get("orderId"));
        
        if(isOrderCanceled){
            return new ResponseEntity<>("Order canceled",HttpStatus.OK); 
        }
        
        return new ResponseEntity<>("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR); 
        
    }
    
    @PostMapping("/search-product")
    public ResponseEntity<?> searchProduct(@RequestBody Map<String,String> data){
        
        try{
            
            System.out.println("---------------------------------------------------------------------------------------------------");
            
            String gender = CustomFunctions.extractGender(data.get("searchQuery"));
            Integer minPrice = CustomFunctions.extractMinPrice(data.get("searchQuery"));
            Integer maxPrice = CustomFunctions.extractMaxPrice(data.get("searchQuery"));
            String productName = CustomFunctions.extractProductName(data.get("searchQuery"), gender, minPrice, maxPrice);

            System.out.println("Product Name: " + productName);
            System.out.println("Gender: " + gender);
            System.out.println("Min Price: " + minPrice);
            System.out.println("Max Price: " + maxPrice);
            
            List<CategoryResponse> catRes = productService.getSearchProducts(productName, minPrice, maxPrice, Integer.valueOf(data.get("userId")));
            
            System.out.println(catRes);
            
            return new ResponseEntity<>(catRes,HttpStatus.OK);
            
        } catch(Exception e){
            System.out.println(e);
        }
        
        
        //m.addAttribute("products", products);
        
        /*if(!products.isEmpty()) {
            List<Product> relatedProducts = productService.getByCategory(products.get(0).getCategory());
            m.addAttribute("relatedProducts", relatedProducts);
        }*/
        
         return new ResponseEntity<>("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR); 
        
    }
 
}
