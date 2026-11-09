DROP DATABASE IF EXISTS itcs223_store;
CREATE DATABASE itcs223_store;
USE itcs223_store;

-- Customer Table
CREATE TABLE Customer (
    cID VARCHAR(8) PRIMARY KEY,
    phoneNo VARCHAR(10) NOT NULL,
    cEmail VARCHAR(50) NOT NULL,
    cPassword VARCHAR(100) NOT NULL,
    cAddress VARCHAR(100) NOT NULL,
    cFirstName VARCHAR(50) NOT NULL,
    cLastName VARCHAR(50) NOT NULL,
    cGender ENUM('Male', 'Female') NOT NULL,
    cBirthDate DATE NOT NULL,
    cPicture VARCHAR(255) NOT NULL
);

-- Account Table
CREATE TABLE Admin (
    adminID VARCHAR(4) PRIMARY KEY,
    birthdate DATE,
    Fname VARCHAR(50) NOT NULL,
    Lname VARCHAR(50) NOT NULL,
    phoneNo VARCHAR(10) NOT NULL,
    Address VARCHAR(255) NOT NULL
);

-- Admin Login Info Table
CREATE TABLE AdminLoginInfo (
    userName VARCHAR(20) PRIMARY KEY,
    password VARCHAR(20) NOT NULL,
    loginLog DATETIME NULL
);

-- Product Table
CREATE TABLE Product (
    productID VARCHAR(6) PRIMARY KEY,
    adminID VARCHAR(4) NOT NULL,
    productName VARCHAR(100) NOT NULL,
    productAmount INT NOT NULL CHECK (productAmount >= 0),
    productCategory VARCHAR(50) NOT NULL,
    productImage VARCHAR(255) NOT NULL,
    productBrand VARCHAR(50),
    productDetail VARCHAR(500),
    FOREIGN KEY (adminID) REFERENCES Admin(adminID)
);

-- Order Table
CREATE TABLE Orders (
    orderID VARCHAR(8) PRIMARY KEY,
    orderName VARCHAR(50) NOT NULL,
    orderStatus ENUM('Pending', 'Paid', 'Shipped', 'Cancelled', 'Completed') NOT NULL,
    orderDate DATE NOT NULL,
    cID VARCHAR(8),
    FOREIGN KEY (cID) REFERENCES Customer(cID)
);

-- Payment Table
CREATE TABLE Payment (
    pmID VARCHAR(10) PRIMARY KEY,
    pmDate DATETIME NOT NULL,
    pmName VARCHAR(50) NOT NULL,
    pmStatus ENUM('Success', 'Failed', 'Pending') NOT NULL,
    pmAmount DECIMAL(10,2) NOT NULL CHECK (pmAmount >= 0),
    Method VARCHAR(20) NOT NULL,
    PromptPay VARCHAR(50),
    CreditCard VARCHAR(50),
    TrueMoney VARCHAR(50),
    orderID VARCHAR(8),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID)
);

-- Delivery Table
CREATE TABLE Delivery (
    deliTrackNum VARCHAR(20) PRIMARY KEY,
    deliStatus ENUM('Delivered','Cancelled','In transit','Out for delivery') NOT NULL,
    deliAddr VARCHAR(50) NOT NULL,
    orderID VARCHAR(8),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID)
);

INSERT INTO Customer (cID, phoneNo, cEmail, cPassword, cAddress, cFirstName, cLastName, cGender, cBirthDate, cPicture) VALUES
('C0000001', '0811234567', 'somchai@email.com', 'pwd001', '123 Rama 9, Bangkok', 'Somchai', 'Saetang', 'Male', '2004-05-20', 'https://i.postimg.cc/zGTFWw8k/Profile-Picture.png'),
('C0000002', '0822345678', 'mali@email.com', 'pwd002', '45 Nimman, Chiang Mai', 'Mali', 'Rakthai', 'Female', '1998-06-14', 'https://i.postimg.cc/zGTFWw8k/Profile-Picture.png'),
('C0000003', '0833456789', 'kitti@email.com', 'pwd003', '77 Mittraphap, Khon Kaen', 'Kitti', 'Boonmee', 'Male', '2000-08-17', 'https://i.postimg.cc/zGTFWw8k/Profile-Picture.png'),
('C0000004', '0844567890', 'ananya@email.com', 'pwd004', '12 Walking St, Pattaya', 'Ananya', 'Siri', 'Female', '2004-01-12', 'https://i.postimg.cc/zGTFWw8k/Profile-Picture.png'),
('C0000005', '0855678901', 'preecha@email.com', 'pwd005', '88 Phuket Rd, Phuket', 'Preecha', 'Klang', 'Male', '1992-03-01', 'https://i.postimg.cc/zGTFWw8k/Profile-Picture.png'),
('C0000006', '0866789012', 'sunisa@email.com', 'pwd006', '9/1 Bang Na, Bangkok', 'Sunisa', 'Jaidee', 'Female', '1993-11-12', 'https://i.postimg.cc/zGTFWw8k/Profile-Picture.png'),
('C0000007', '0877890123', 'veera@email.com', 'pwd007', '23 Hat Yai, Songkhla', 'Veera', 'Suksamran', 'Male', '1996-12-08', 'https://i.postimg.cc/zGTFWw8k/Profile-Picture.png'),
('C0000008', '0888901234', 'nipa@email.com', 'pwd008', '55 Salaya, Nakhon Pathom', 'Nipa', 'Wongsuwan', 'Female', '1991-04-12', 'https://i.postimg.cc/zGTFWw8k/Profile-Picture.png'),
('C0000009', '0899012345', 'anon@email.com', 'pwd009', '101 Udon Rd, Udon Thani', 'Anon', 'Duangdee', 'Male', '2005-09-15', 'https://i.postimg.cc/zGTFWw8k/Profile-Picture.png'),
('C000010', '0810123456', 'pimpa@email.com', 'pwd010', '22 Pak Kret, Nonthaburi', 'Pimpa', 'Thongdee', 'Female', '1997-08-22', 'https://i.postimg.cc/zGTFWw8k/Profile-Picture.png');

INSERT INTO Admin (adminID, birthdate, Fname, Lname, phoneNo, Address) VALUES
('A001', '1990-05-15', 'Somchai', 'Jaidee', '0891234567', '99/1 Bang Kapi, Bangkok, Thailand'),
('A002', '1985-09-22', 'Suda', 'Kanya', '0812345678', '45/3 Suthep, Mueang Chiang Mai, Chiang Mai, Thailand'),
('A003', '1992-12-10', 'Anan', 'Sukjai', '0923456789', '120/5 Patong, Kathu, Phuket, Thailand'),
('A004', '1988-03-08', 'Malee', 'Thongdee', '0954567890', '88/2 Salaya, Phutthamonthon, Nakhon Pathom, Thailand'),
('A005', '1995-07-19', 'Prasit', 'Chaiyo', '0965678901', '77/7 Nai Mueang, Mueang Khon Kaen, Khon Kaen, Thailand'),
('A006', '1991-11-30', 'Niran', 'Boonmee', '0986789012', '56/4 Pak Kret, Nonthaburi, Thailand'),
('A007', '1987-06-25', 'Kanya', 'Srisai', '0937890123', '23/9 Hat Yai, Songkhla, Thailand'),
('A008', '1993-01-14', 'Wichai', 'Rattanakul', '0948901234', '101/6 Mueang Chonburi, Chonburi, Thailand'),
('A009', '1989-08-09', 'Supaporn', 'Meechai', '0919012345', '67/8 Mueang Udon Thani, Udon Thani, Thailand'),
('A010', '1994-04-18', 'Thanakorn', 'Phasuk', '0970123456', '150/10 Si Racha, Chonburi, Thailand');

INSERT INTO AdminLoginInfo (userName, password, loginLog) VALUES
('admin01', 'admin123', '2026-03-25 08:15:30'),
('admin02', 'admin123', '2026-03-25 09:20:10'),
('admin03', 'admin123', '2026-03-25 10:05:45'),
('admin04', 'admin123', '2026-03-25 11:30:00'),
('admin05', 'admin123', '2026-03-25 13:10:25'),
('admin06', 'admin123', '2026-03-25 14:45:50'),
('admin07', 'admin123', '2026-03-25 15:20:30'),
('admin08', 'admin123', '2026-03-25 16:45:10'),
('admin09', 'admin123', '2026-03-25 17:30:45'),
('admin10', 'admin123', '2026-03-25 18:15:20');


INSERT INTO Product (productID, adminID, productName, productAmount, productCategory, productImage, productBrand, productDetail) VALUES
('P00001', 'A001', 'Multi-color Plastic Basket', 500, 'Kitchen', 'https://www.bakerross.co.uk/media/catalog/product/f/c/fc892v-c2.jpg', '-', 'Versatile multi-purpose plastic storage basket. Made from high-quality Grade A PP plastic, durable and sturdy. Perfect for organizing office desks, bathrooms, or kitchen cabinets. Breathable design prevents moisture buildup.'),
('P00002', 'A002', 'Pack of 3 Blue Ballpoint Pens', 300, 'Stationery', 'https://pim-cdn0.ofm.co.th/products/original/1091584.jpg?v=20260330&x-image-process=image/format,webp', 'Double A', 'Set of 3 premium blue ink ballpoint pens with a 0.5mm needle tip. Provides a smooth, skip-free writing experience. Quick-drying ink prevents smudging, making it ideal for students and office professionals.'),
('P00003', 'A003', 'Stainless Steel Vegetable Peeler', 150, 'Kitchen', 'https://www.vipshopboutic.com/cdn/shop/products/178172_2.jpg?v=1692863993&width=1445', 'Zebra', 'High-quality fruit and vegetable peeler featuring a sharp stainless steel blade. Rust-resistant and long-lasting. Ergonomically designed handle provides a comfortable grip, making food preparation effortless and safe.'),
('P00004', 'A004', 'Microfiber Cleaning Cloth', 400, 'Cleaning', 'https://www.nitori.co.th/cdn/shop/files/898245132_640x640.jpg?v=1730701389', 'NITORI', 'Ultra-soft microfiber cloth with 5x higher water absorption than standard towels. Scratch-free and lint-free. Perfect for cleaning delicate surfaces like glassware, dinnerware, or electronic screens.'),
('P00005', 'A005', 'Crispy Fish Snack Pack', 250, 'Snacks', 'https://st.bigc-cs.com/cdn-cgi/image/format=webp,quality=90/public/media/catalog/product/14/88/8852044592414/8852044592414_1-20230323160759-.jpg', 'Taro', 'Crispy baked fish snacks with a spicy and bold flavor. Low calorie, high protein, and no preservatives. Convenient portable size, perfect for a mid-afternoon snack or enjoying during a movie.'),
('P00006', 'A006', 'Gaiatop Mini Desk Fan (USB)', 50, 'Electronics', 'https://i.pinimg.com/1200x/3f/0b/d7/3f0bd793fc001220462e80dee8fed57d.jpg', 'CoolMe', 'Compact mini desk fan powered via USB port. Features 3 adjustable speed settings with an ultra-quiet motor. Modern, space-saving design ideal for office desks, bedside tables, or traveling.'),
('P00007', 'A007', 'Plastic Food Container Set', 200, 'Kitchen', 'https://i.pinimg.com/736x/62/92/3c/62923cfba40e4646839966005a1316d0.jpg', 'SafeLock', 'Set of 2 airtight food storage containers. Secure locking lids prevent leaks and keep food fresh for longer. Microwave safe (excluding lids) and easy to clean. Stackable design saves cabinet space.'),
('P00008', 'A008', 'Lifeventure USB Travel Adapter', 80, 'Electronics', 'https://i.pinimg.com/1200x/25/42/47/2542474cff6ccbb1f7f0fefa95e0003f.jpg', 'PowerUp', 'Universal travel adapter compatible with outlets in over 150 countries. Includes dual USB ports for simultaneous charging of smartphones and tablets. Made from flame-retardant materials for extra safety.'),
('P00009', 'A009', 'Scented Candle - Jasmine', 120, 'Home', 'https://i.pinimg.com/736x/d0/93/78/d09378d019c2901cfe21da16ab0ead06.jpg', 'ThaiScent', 'Natural jasmine-scented candle crafted to create a relaxing home atmosphere. Reduces stress with a long-lasting, soothing aroma. Low-smoke wick ensures clean burning. Perfect for bedrooms or living areas.'),
('P00010', 'A010', 'Pack of 5 Bamboo Chopsticks', 300, 'Kitchen', 'https://m.media-amazon.com/images/I/61jEYji9xML._AC_UF894,1000_QL80_.jpg', 'Panda', '5 pairs of polished natural bamboo chopsticks. Splinter-free and smooth finish for a comfortable dining experience. Reusable and eco-friendly. Standard 24cm length suitable for all types of Asian cuisine.'),
('P00011', 'A001', 'Friction Powered Truck Toy', 100, 'Toys', 'https://m.media-amazon.com/images/I/51sFqCGMt+L._SS400_.jpg', 'MOZXEBOK', 'Durable friction-powered truck toy. Simply push forward and watch it go! Made from high-quality ABS plastic, impact-resistant and safe for kids. Encourages motor skill development in children aged 3+.'),
('P00012', 'A002', 'Double Layer Race Truck', 124, 'Toys', 'https://m.media-amazon.com/images/I/51zHaEO4n7L._SS400_.jpg', 'Bstoyder', 'Large double-layer race car hauler. Includes 4 small racing cars. Features realistic engine sounds and light effects. The back ramp opens to launch cars. A perfect gift for boys and girls who love vehicles.'),
('P00013', 'A003', 'Manual Coffee Grinder', 45, 'Kitchen', 'https://image.makewebeasy.net/makeweb/m_1920x0/aSAKumEHs/etc/12_1.jpg', 'Hillkoff', 'Premium manual coffee bean grinder with adjustable grind settings. High-quality ceramic burr ensures a consistent grind without heat buildup, preserving the natural aroma and flavor of your coffee beans.'),
('P00014', 'A004', 'Desktop Organizer Box', 180, 'Office', 'https://cdn01.pinkoi.com/product/UuRsYshh/7/640x530.jpg', '-', 'Minimalist desktop organizer with multiple compartments for pens, paper clips, and sticky notes. Translucent matte finish fits any desk aesthetic. Keeps your workspace tidy and essential items within reach.'),
('P00015', 'A005', 'Yoga Mat Cleaning Spray', 90, 'Health', 'https://m.media-amazon.com/images/I/818-JQRf+EL.jpg', 'Asutra', 'Organic yoga mat cleaner that eliminates 99.9% of bacteria and sweat odors. Infused with peppermint essential oil for a refreshing scent. Fast-drying, non-greasy formula safe for all mat materials.'),
('P00016', 'A006', 'LED Reading Light (Clip-on)', 75, 'Electronics', 'https://m.media-amazon.com/images/I/71O3tFwgMdL.jpg', 'KTEBO', 'Flexible clip-on reading light with a 360-degree gooseneck. Warm white LED light is easy on the eyes. Rechargeable via USB with up to 5 hours of continuous use. Ideal for late-night reading or studying.'),
('P00017', 'A007', 'Ceramic Ramen Bowl', 60, 'Kitchen', 'https://images.squarespace-cdn.com/content/v1/60b65cba9c76c2177da28451/71c2b2e4-d86c-4a1a-a29c-49fd003fb415/IMG_6526.jpg', 'Daphnia Ceramics', 'Japanese-style ceramic bowl, extra-large 8-inch size. Heat resistant and durable. Hand-painted elegant patterns make it a beautiful addition to your kitchen. Perfect for ramen, noodles, or hearty soups.'),
('P00018', 'A008', 'Universal Screen Protector Kit', 200, 'Electronics', 'https://i5.walmartimages.com/seo/WriteRight-Universal-Screen-Protector-for-Screens-up-to-6-8-2-Pack_1c3773e2-b5f2-41bd-856a-3280a185695d.d05b9d1a483e4ae9f08ee7f306ec01b1.jpeg', '-', 'Complete screen protection kit including universal film, screen cleaning solution, and a lint-free cloth. Prevents scratches, smudges, and fingerprints. Compatible with most smartphones and tablets.'),
('P00019', 'A009', 'Essential Oil Diffuser', 35, 'Home', 'https://www.innogear.com/cdn/shop/files/InnoGearEssentialOilDiffuser_150MLCeramicDiffuserforHomeHandcraftedAromatherapyDiffuserUltrasonicCoolMistHumidifierwith2MistModesWaterlessAutoOffforRoomOffice_Black_7_2400x.jpg?v=1703586449', 'InnoGear', 'Portable ultrasonic humidifier and essential oil diffuser. Enhances air moisture while dispersing soothing scents. Features 7-color changing LED lights. Auto-shutoff safety feature when water runs out.'),
('P00020', 'A010', 'Gardening Tool Set (3 Pcs)', 110, 'Garden', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeqOyZ_6QbaE-grQjsnzVVoeJXpPFPuio9wg&s', 'GreenThumb', 'Mini 3-piece gardening set including a trowel, transplanter, and rake. Made from rust-resistant steel with ergonomic wooden handles. Perfect for indoor houseplants, succulents, or balcony gardening.');

INSERT INTO Orders (orderID, orderName, orderStatus, orderDate, cID) VALUES
('ORD00001', 'Kitchen Essentials', 'Paid', '2026-03-20', 'C0000001'),
('ORD00002', 'Stationery Set', 'Shipped', '2026-03-21', 'C0000002'),
('ORD00003', 'Snack Bundle', 'Completed', '2026-03-22', 'C0000003'),
('ORD00004', 'Bathroom Plastic', 'Pending', '2026-03-23', 'C0000004'),
('ORD00005', 'Home Cleaning Kit', 'Paid', '2026-03-24', 'C0000005'),
('ORD00006', 'Dorm Essentials', 'Shipped', '2026-03-25', 'C0000006'),
('ORD00007', 'Gift Pack', 'Cancelled', '2026-03-25', 'C0000007'),
('ORD00008', 'Daily Sundries', 'Paid', '2026-03-26', 'C0000008'),
('ORD00009', 'Kitchenware', 'Pending', '2026-03-26', 'C0000009'),
('ORD00010', 'Study Room Gear', 'Paid', '2026-03-26', 'C000010');

INSERT INTO Delivery (deliTrackNum, deliStatus, deliAddr, orderID) VALUES
('TH0101FL', 'Delivered', '123 Rama 9, Bangkok', 'ORD00001'),
('TH0102FL', 'In transit', '45 Nimman, Chiang Mai', 'ORD00002'),
('TH0103FL', 'Delivered', '77 Mittraphap, Khon Kaen', 'ORD00003'),
('TH0104FL', 'Delivered', '12 Walking St, Pattaya', 'ORD00004'),
('TH0105FL', 'Out for delivery', '88 Phuket Rd, Phuket', 'ORD00005'),
('TH0106FL', 'In transit', '9/1 Bang Na, Bangkok', 'ORD00006'),
('TH0107FL', 'Cancelled', '23 Hat Yai, Songkhla', 'ORD00007'),
('TH0108FL', 'Out for delivery', '55 Salaya, Nakhon Pathom', 'ORD00008'),
('TH0109FL', 'In transit', '101 Udon Rd, Udon Thani', 'ORD00009'),
('TH0110FL', 'Delivered', '22 Pak Kret, Nonthaburi', 'ORD00010');