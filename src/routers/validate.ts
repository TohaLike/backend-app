import { body } from "express-validator";

export const validatePhoneOrEmail = [
  body("id").custom((value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;
  
    if (!emailRegex.test(value) && !phoneRegex.test(value)) {
      throw new Error("Введите корректный email или номер телефона");
    }
  
    return true;
  }),
];