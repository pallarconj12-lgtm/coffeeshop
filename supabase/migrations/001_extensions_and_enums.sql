-- Extensions
create extension if not exists "pgcrypto";

-- Enums
create type staff_role as enum ('owner', 'manager', 'staff');
create type order_status as enum ('pending', 'preparing', 'ready', 'completed', 'cancelled');
create type roast_level as enum ('light', 'medium', 'dark');
create type fulfillment_type as enum ('pickup', 'delivery');
