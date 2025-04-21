package com.springboot.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.JsonResponse.CategoryResponse;
import com.springboot.models.Category;
import com.springboot.models.Product;
import com.springboot.repository.CategoryRepo;
import com.springboot.service.CategoryService;
import com.springboot.service.ProductService;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/admin/")
public class AdminController {
    
    @Autowired
    private CategoryRepo categoryRepo;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping("/getCategory")
    public ResponseEntity<?> getCategory(){
        
        // for displaying category in navbar
        
        List<CategoryResponse> category =  categoryService.getAllCategory();
        
        if(ObjectUtils.isEmpty(category)){
            
            return new ResponseEntity<>("Something went wrong",HttpStatus.INTERNAL_SERVER_ERROR);
            
        } 
        
        return new ResponseEntity<>(category,HttpStatus.OK);
        
    }
    
    @PostMapping("/addCategory")
    public ResponseEntity<?> addCategory(@RequestBody Category category){
        
        try{
            categoryRepo.save(category);
            
            return new ResponseEntity<>("Category addedd",HttpStatus.OK);
            
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }
    
    @PostMapping("/addProduct")
    public ResponseEntity<?> addProduct(@RequestPart("product") String productJson, @RequestPart("selectedCategory") String selectedCategory, 
                                    @RequestPart("image") MultipartFile file){
        
        try{
            
            ObjectMapper objectMapper = new ObjectMapper();
            Product product = objectMapper.readValue(productJson, Product.class);
            CategoryResponse category = objectMapper.readValue(selectedCategory, CategoryResponse.class);
            product.setCategory(Category.builder().id(category.getId()).catName(category.getCatName()).sectionName(category.getSectionName()).build());
            
            File uploadImage = new ClassPathResource("static").getFile();
                
            Path path = Paths.get(uploadImage.getAbsolutePath() + File.separator + "products" + File.separator + file.getOriginalFilename());
                
            System.out.println("Path : " + path);
                
            Files.copy(file.getInputStream(), path,StandardCopyOption.REPLACE_EXISTING);
            
            product.setProductImage(file.getOriginalFilename());
            
            productService.addProduct(product);
            
            return new ResponseEntity<>(product,HttpStatus.OK);
            
        }catch(IOException e){
            System.out.println("Error: " + e.getMessage());
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }
    
}
