package com.yume.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminDashboardController {
    
    @GetMapping("/admin")
    public String adminDashboard() {
        return "forward:admin.html";
    }
}
