/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.springboot.repository;

import com.springboot.models.Category;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Yash
 */

@Repository
public interface CategoryRepo extends JpaRepository<Category, Integer>  {
    
    public List<Category> findBySectionName(String section);
    
    public List<Category> findBySectionNameStartingWith(String sectionName);
    
}
