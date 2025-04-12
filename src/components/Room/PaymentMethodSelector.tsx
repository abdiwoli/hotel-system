'use client';

import { FC } from 'react';

interface Props {
    selected: 'stripe' | 'chapa';
    onSelect: (method: 'stripe' | 'chapa') => void;
}

const PaymentMethodSelector: FC<Props> = ({ selected, onSelect }) => {
    return (
        <div className="flex gap-4 items-center mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    checked={selected === 'stripe'}
                    onChange={() => onSelect('stripe')}
                    className="accent-blue-600"
                />
                Pay with International Card (Stripe)
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    checked={selected === 'chapa'}
                    onChange={() => onSelect('chapa')}
                    className="accent-green-600"
                />
                Pay with Chapa (Local)
            </label>
        </div>
    );
};

export default PaymentMethodSelector;
