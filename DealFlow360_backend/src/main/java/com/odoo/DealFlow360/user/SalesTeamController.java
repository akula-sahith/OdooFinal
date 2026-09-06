package com.odoo.DealFlow360.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales-teams")
public class SalesTeamController {

    private final SalesTeamService salesTeamService;

    @Autowired
    public SalesTeamController(SalesTeamService salesTeamService) {
        this.salesTeamService = salesTeamService;
    }

    public static class SalesTeamRequest {
        public String name;
    }

    @GetMapping
    public ResponseEntity<List<SalesTeam>> getAllSalesTeams() {
        return ResponseEntity.ok(salesTeamService.findAllSalesTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSalesTeamById(@PathVariable Long id) {
        return salesTeamService.findSalesTeamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createSalesTeam(@RequestBody SalesTeamRequest request) {
        if (request == null || request.name == null || request.name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Sales team name is required");
        }
        try {
            SalesTeam team = salesTeamService.createSalesTeam(request.name);
            SalesTeam saved = salesTeamService.saveSalesTeam(team);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSalesTeam(@PathVariable Long id, @RequestBody SalesTeamRequest request) {
        if (request == null || request.name == null || request.name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Sales team name is required");
        }
        return salesTeamService.findSalesTeamById(id)
                .map(team -> {
                    salesTeamService.renameSalesTeam(team, request.name);
                    SalesTeam updated = salesTeamService.saveSalesTeam(team);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSalesTeam(@PathVariable Long id) {
        if (salesTeamService.findSalesTeamById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        salesTeamService.deleteSalesTeam(id);
        return ResponseEntity.ok(Map.of("message", "Sales team deleted successfully"));
    }
}
