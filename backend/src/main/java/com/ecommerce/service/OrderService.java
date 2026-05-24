package com.ecommerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.model.Cart;
import com.ecommerce.model.Order;
import com.ecommerce.repository.OrderRepository;

@Service
public class OrderService {
	
	@Autowired
	private OrderRepository orderRepository ;

	@Autowired
	private CartService cartService;
	
	
	public Order placeOrder(Cart cart) {
		if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
	        throw new RuntimeException("Cart is empty");
	    }
		double total = 0 ;
		
		for(var item: cart.getItems()) {
			total = total+item.getQuantity() * 100 ; 
			
		}
		
		Order order = new Order();
		order.setUserId(cart.getUserId());
		order.setTotalAmount(total);
		Order savedOrder = orderRepository.save(order);
		cartService.clearCart((int) cart.getUserId());
		return savedOrder;		
	}

	public List<Order> getOrdersForUser(long userId) {
		return orderRepository.findByUserId(userId);
	}

	public void deleteOrder(long orderId) {
		if (orderRepository.existsById(orderId)) {
			orderRepository.deleteById(orderId);
		}
	}

}
