import * as React from 'react';
import type { ChangeEventHandler } from 'react';

type Props = {
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    onSubmit: () => void;
    onClear: () => void;
}

export const SearchBar = ({ value, onChange, onSubmit, onClear }: Props) => (
    <div>
        <input value={value} onChange={onChange} />
        <button onClick={onSubmit}>Get</button>
        <button onClick={onClear}>Clear</button>
    </div>
)