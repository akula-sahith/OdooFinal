package com.odoo.DealFlow360.user;

import java.util.Objects;

/**
 * Domain model representing a Sales Team in the system (SALES_TEAMS table).
 */
public class SalesTeam {

    private Long id;
    private String name;

    public SalesTeam() {
    }

    public SalesTeam(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        SalesTeam salesTeam = (SalesTeam) o;
        return Objects.equals(id, salesTeam.id) &&
                Objects.equals(name, salesTeam.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return "SalesTeam{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
