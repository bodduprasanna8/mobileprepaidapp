package com.example.demo.controller;

import com.example.demo.model.Subscriber;
import com.example.demo.repository.SubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscribers")
@CrossOrigin(origins = "http://localhost:4200")
public class PublicSubscriberController {
    @Autowired
    private SubscriberRepository subscriberRepository;

    // Check if subscriber exists (by mobile number)
    @GetMapping("/find")
    public ResponseEntity<Subscriber> findSubscriber(@RequestParam String mobileNumber) {
        Subscriber subscriber = subscriberRepository.findByMobileNumber(mobileNumber);
        if (subscriber != null) {
            return ResponseEntity.ok(subscriber);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Register a new subscriber
    @PostMapping("/register")
    public ResponseEntity<Subscriber> registerSubscriber(@RequestBody Subscriber subscriber) {
        if (subscriberRepository.findByMobileNumber(subscriber.getMobileNumber()) != null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(subscriberRepository.save(subscriber));
    }
}