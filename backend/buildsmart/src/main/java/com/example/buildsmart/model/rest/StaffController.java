package com.example.buildsmart.model.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StaffController {
    // expose "/" that return "Hello Staff Member"

    @GetMapping("/")
    public String sayHello(){
        return "Hello Staff Member!";
    }
}
