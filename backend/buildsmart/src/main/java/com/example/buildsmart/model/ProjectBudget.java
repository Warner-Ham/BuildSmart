package com.example.buildsmart.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "project_budgets")
public class ProjectBudget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bgt_id;

    private Long proj_id;
    private Double machinery;
    private Double materials;
    private Double labour_general;
    private Double labour_skilled;
    private Double subcontractors;
    private Double other_costs;
    private Double total_budget;
    @Temporal(TemporalType.DATE)
    private Date allocated_date;

    // Getters and setters
    public Long getBgt_id() { return bgt_id; }
    public void setBgt_id(Long bgt_id) { this.bgt_id = bgt_id; }
    public Long getProj_id() { return proj_id; }
    public void setProj_id(Long proj_id) { this.proj_id = proj_id; }
    public Double getMachinery() { return machinery; }
    public void setMachinery(Double machinery) { this.machinery = machinery; }
    public Double getMaterials() { return materials; }
    public void setMaterials(Double materials) { this.materials = materials; }
    public Double getLabour_general() { return labour_general; }
    public void setLabour_general(Double labour_general) { this.labour_general = labour_general; }
    public Double getLabour_skilled() { return labour_skilled; }
    public void setLabour_skilled(Double labour_skilled) { this.labour_skilled = labour_skilled; }
    public Double getSubcontractors() { return subcontractors; }
    public void setSubcontractors(Double subcontractors) { this.subcontractors = subcontractors; }
    public Double getOther_costs() { return other_costs; }
    public void setOther_costs(Double other_costs) { this.other_costs = other_costs; }
    public Double getTotal_budget() { return total_budget; }
    public void setTotal_budget(Double total_budget) { this.total_budget = total_budget; }
    public Date getAllocated_date() { return allocated_date; }
    public void setAllocated_date(Date allocated_date) { this.allocated_date = allocated_date; }
}
