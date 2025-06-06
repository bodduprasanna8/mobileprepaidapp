package com.example.demo.controller;

import com.example.demo.model.Plan;
import com.example.demo.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/plans")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminPlanController {

    @Autowired
    private PlanRepository planRepository;

    // Get all plans
    @GetMapping
    public ResponseEntity<List<Plan>> getAllPlans() {
        return ResponseEntity.ok(planRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Plan> addPlan(@RequestBody Plan plan) {
        Plan savedPlan = planRepository.save(plan);
        return ResponseEntity.ok(savedPlan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plan> updatePlan(@PathVariable Long id, @RequestBody Plan updatedPlan) {
        return planRepository.findById(id)
                .map(plan -> {
                    plan.setName(updatedPlan.getName());
                    plan.setCategory(updatedPlan.getCategory());
                    plan.setPrice(updatedPlan.getPrice());
                    plan.setDataPerDay(updatedPlan.getDataPerDay());
                    plan.setCalls(updatedPlan.getCalls());
                    plan.setSms(updatedPlan.getSms());
                    plan.setValidityDays(updatedPlan.getValidityDays());
                    Plan saved = planRepository.save(plan);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete plan (DELETE /api/admin/plans/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Plan> deletePlan(@PathVariable Long id) {
        Optional<Plan> planOpt = planRepository.findById(id);
        if (planOpt.isPresent()) {
            planRepository.deleteById(id);
            return ResponseEntity.ok(planOpt.get()); // Return the deleted plan
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}