package com.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.dto.OrderRequest;
import com.ecommerce.model.Cart;
import com.ecommerce.model.Order;
import com.ecommerce.service.CartService;
import com.ecommerce.service.OrderService;

@RestController
@RequestMapping("/orders")
public class OrderController {
	@Autowired
	private CartService cartService ; 
	
	@Autowired
	private OrderService orderService ;
	
	@PostMapping
	public Order placeOrder(@RequestBody OrderRequest request) {
		Cart cart = cartService.getCart(request.getUserId());
		return orderService.placeOrder(cart);
	}

	@GetMapping("/{userId}")
	public List<Order> getOrdersForUser(@PathVariable long userId) {
		return orderService.getOrdersForUser(userId);
	}

	@DeleteMapping("/delete/{orderId}")
	public void deleteOrder(@PathVariable long orderId) {
		orderService.deleteOrder(orderId);
	}
	
}
