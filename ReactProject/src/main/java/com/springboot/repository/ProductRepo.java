/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.springboot.repository;

import com.springboot.models.Category;
import com.springboot.models.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Yash
 */

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {
   
        
        @Query(value = "SELECT * FROM product p " +
               "WHERE MATCH(p.product_name, p.product_desc) AGAINST (:query IN BOOLEAN MODE) " +
               "AND (:minPrice IS NULL OR p.product_price >= :minPrice) " +
               "AND (:maxPrice IS NULL OR p.product_price <= :maxPrice)" +
               "AND p.category_id = :categoryId", 
       nativeQuery = true)
        List<Product> getSearchProducts(
            @Param("query") String query,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("categoryId") Integer categoryId
        );
        
        @Query(value = "SELECT p.category_id FROM product p " +
               "WHERE MATCH(p.product_name, p.product_desc) AGAINST (:query IN BOOLEAN MODE) " +
               "AND (:minPrice IS NULL OR p.product_price >= :minPrice) " +
               "AND (:maxPrice IS NULL OR p.product_price <= :maxPrice) " +
               "LIMIT 1", nativeQuery = true)
            Integer getFirstProductCategory(
                @Param("query") String query,
                @Param("minPrice") Integer minPrice,
                @Param("maxPrice") Integer maxPrice
            );
        
        public List<Product> findByCategory(Category category);
        
        @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId ORDER BY FUNCTION('RAND') LIMIT 4")
        public List<Product> getRandomProducts(@Param("categoryId") int categoryId);

}
