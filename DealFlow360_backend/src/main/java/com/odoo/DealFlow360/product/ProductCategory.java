package com.odoo.DealFlow360.product;

import java.util.Objects;

/**
 * Domain model representing a Product Category in the system (PRODUCT_CATEGORIES table).
 */
public class ProductCategory {

    private Long id;
    private String name;

    public ProductCategory() {
    }

    public ProductCategory(Long id, String name) {
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
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductCategory that = (ProductCategory) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return "ProductCategory{" +
               "id=" + id +
               ", name='" + name + '\'' +
               '}';
    }
}
