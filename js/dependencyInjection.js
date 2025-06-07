// 1.构造函数注入（最常用）
class UserService {
  // 声明依赖但不创建
  constructor(userRepository, logger) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  getUser(id) {
    this.logger.log(`Fetching user ${id}`);
    return this.userRepository.getUser(id);
  }
}

// 依赖在外部创建并注入
const userRepository = { getUser: id => ({ id, name: 'John' }) };
const logger = { log: msg => console.log(msg) };

const userService = new UserService(userRepository, logger);
userService.getUser(1);

// 2. 属性/Setter 注入
class PaymentService {
  setPaymentGateway(gateway) {
    this.gateway = gateway;
  }

  processPayment(amount) {
    return this.gateway.charge(amount);
  }
}

const paymentService = new PaymentService();
paymentService.setPaymentGateway({ charge: amt => `Charged $${amt}` });
paymentService.processPayment(100);

// 3. 函数参数注入
// 依赖作为函数参数传入
function sendEmail(user, emailService) {
  return emailService.send(user.email, 'Welcome!');
}

const mockEmailService = { send: (to, msg) => console.log(`Sending to ${to}`) };
sendEmail({ email: 'test@example.com' }, mockEmailService);