
# ShopEase

ShopEase is an e-commerce application designed to handle promo codes and referrals to enhance user engagement and boost sales.

## Architecture Design
![Architecture Diagram](/Architecture.png)
### Promo Codes
Promo codes in ShopEase are created via the `/api/promocodes` endpoint by administrators. These codes can offer discounts as either a percentage or a fixed amount. Promo codes can have expiry dates and usage limits to control their validity and applicability.

- **Generation**: Admins create promo codes with specified details including type, value, expiry, and usage limits.
- **Distribution**: Promo codes are distributed through marketing channels, user accounts, or promotional campaigns.
- **Validation**: During checkout, promo codes are validated through the `/api/promocodes/apply` endpoint to ensure they are valid, not expired, and within the usage limit.
- **Types**: 
  - **Percentage Discount**: Discounts applied as a percentage of the total order.
  - **Fixed Amount Discount**: Discounts applied as a fixed amount off the total order.
  - **One-Time Use**: Can be used only once per user or transaction.
  - **Limited-Time Use**: Valid only within a specific time frame.

### Referrals
The referral system allows users to refer others by providing a referral code. New users can redeem these referral codes for benefits. Referrers receive a promo code as an incentive for each successful referral.

- **Process**: Users generate referral codes, which new users use to receive benefits.
- **Incentive**: Successful referrers receive a promo code as a reward.
- **Tracking**: Referral status (pending or used) is tracked, and the status is updated when a referred user completes a purchase.

### Data Flow
The key entities involved are `User`, `PromoCode`, and `Referral`. Users apply promo codes during checkout and refer others using referral codes. All data related to promo codes and referrals is stored in MongoDB.

- **Entities**:
  - `User`: Represents customers who use promo codes and referral codes.
  - `PromoCode`: Represents promotional codes available for discounts.
  - `Referral`: Represents the relationships between users for referrals.
- **Relationships**: 
  - Users apply promo codes during checkout.
  - Users generate referral codes and receive incentives.
  - Promo codes and referrals are managed and stored in MongoDB.

### Security
To prevent abuse and fraud:
- **Promo Codes**: Implement rate limiting and validation checks. Ensure codes are unique and not easily guessable.
- **Referrals**: Ensure referral codes are unique and track their usage. Validate that codes are redeemed only once per new user.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Tanvisharma31/shopease.git
   cd shopease
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   Ensure MongoDB is installed and running locally:
   ```bash
   mongod
   ```

4. **Run the Server**
   For development with auto-reloading:
   ```bash
   npm run dev
   ```
   For production:
   ```bash
   npm start
   ```

## Assumptions

- MongoDB is installed and running on the local machine.
- The application focuses on basic promo code and referral functionality without complex business rules.
- Basic validation and error handling are implemented.

## Architecture Diagrams

 !(/Architecture.png)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
