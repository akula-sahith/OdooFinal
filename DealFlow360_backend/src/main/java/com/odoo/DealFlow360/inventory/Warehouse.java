package com.odoo.DealFlow360.inventory;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Domain model representing a Warehouse in the system (WAREHOUSES table).
 */
public class Warehouse {

    private Long id;
    private String name;
    private String location;
    private BigDecimal shippingWeightFactor;

    public Warehouse() {
    }

    public Warehouse(Long id, String name, String location, BigDecimal shippingWeightFactor) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.shippingWeightFactor = shippingWeightFactor;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getShippingWeightFactor() {
        return shippingWeightFactor;
    }

    public void setShippingWeightFactor(BigDecimal shippingWeightFactor) {
        this.shippingWeightFactor = shippingWeightFactor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Warehouse warehouse = (Warehouse) o;
        return Objects.equals(id, warehouse.id) &&
               Objects.equals(name, warehouse.name) &&
               Objects.equals(location, warehouse.location) &&
               Objects.equals(shippingWeightFactor, warehouse.shippingWeightFactor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, location, shippingWeightFactor);
    }

    @Override
    public String toString() {
        return "Warehouse{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", location='" + location + '\'' +
               ", shippingWeightFactor=" + shippingWeightFactor +
               '}';
    }
}
