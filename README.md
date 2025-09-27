# Pizza Order Management System

## Project Overview

This project is a comprehensive digital solution for a high-volume pizzeria looking to modernize and streamline their order management process. The system digitizes the entire order workflow from customer orders to kitchen preparation and status tracking.

## Business Context

The pizzeria receives a large number of daily orders and aims to transition from traditional paper-based systems to a digital platform that improves efficiency, reduces errors, and enhances customer experience.

## Technical Stack

- **Frontend**: Next.js with Tailwind CSS
- **Cloud Services**: AWS (Amazon Web Services)
- **Database**: AWS DynamoDB
- **Deployment**: AWS Amplify

#### Customer Facing
- **Order Pizza**: User-friendly interface for customers to place orders
- **Order Tracking**: Real-time order status updates
- **User Accounts**: Customer registration and order history

#### Order Management
- **Order Processing**: POST `/order` - Create new orders
- **Status Checking**: GET `/order/{orderId}` - Check order status
- **Order Updates**: Real-time status change notifications

#### Kitchen Operations
- **Orders Queue**: Pending orders management system
- **Preparation Tracking**: Preparing orders workflow
- **Order Completion**: Update and send completed orders

## Workflow Diagram

<img width="807" height="381" alt="image" src="https://github.com/user-attachments/assets/2a627634-70b5-491b-82b9-26a49fb60604" />
