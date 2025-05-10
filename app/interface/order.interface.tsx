interface Customer {
    id: string;
    name: string;
    email: string;
    address: string;
    telephone: string;
}

interface LaundryPartner {
    id: string;
    name: string;
    email: string;
    address: string;
    city: string;
    area: string;
    telephone: string;
    maps_pinpoint: string;
}

interface Package {
    id: string;
    name: string;
    price_text: string;
    description: string;
}

interface Driver {
    id: string | null;
    name: string | null;
    email: string | null;
    telephone: string | null;
}

interface OrderInterface {
    id: string;
    content: string;
    status: string;
    status_payment: string;
    maps_pinpoint: string;
    weight: number | null;
    price: number | null;
    coupon_code: string;
    referral_code: string | null;
    created_at: string;
    note: string | null;
    rating: number;
    review: string;
    pickup_date: string | null;
    customer: Customer;
    laundry_partner: LaundryPartner;
    package: Package;
    driver: Driver;
}

export default OrderInterface