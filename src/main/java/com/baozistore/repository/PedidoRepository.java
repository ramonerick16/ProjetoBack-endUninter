package com.baozistore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.baozistore.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}
