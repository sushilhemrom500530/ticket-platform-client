/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { GoPlus } from 'react-icons/go';
import { HiMinus } from 'react-icons/hi';

const AccordionItem = ({ title, content, isActive, onToggle, color }: { title: string; content: string; isActive: boolean; onToggle: () => void; color: string }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState('0px');

    useEffect(() => {
        setHeight(isActive ? `${contentRef?.current?.scrollHeight}px` : '0px');
    }, [isActive]);

    const borderColor = isActive ? color : '';

    return (
        <div className={`py-4 border-b border-gray-200 ${borderColor}`}>
            <button
                className={`accordion-toggle group inline-flex items-center justify-between leading-8 w-full transition cursor-pointer duration-500 hover:text-[${color}]`}
                onClick={onToggle}
                style={{ color: isActive ? color : '', borderColor: isActive ? color : '' }}
            >
                <h5 className={`text-lg font-medium`} style={{ color: isActive ? color : '' }}>{title}</h5>
                <span>
                    {isActive ? (
                        <HiMinus size={22} className={`transition duration-500`} style={{ color: color }} />
                    ) : (
                        <GoPlus size={22} className={`transition duration-500 group-hover:text-[${color}]`} />
                    )}
                </span>
            </button>
            <div
                ref={contentRef}
                className="accordion-content w-full px-0 overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: height }}
            >
                <p className="text-base text-gray-600 leading-6 pr-4">{content}</p>
            </div>
        </div>
    );
};

const BorderAccordion = ({ items, color }: { items: { title: string; content: string }[]; color: string }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="accordion-group py-5">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    content={item.content}
                    isActive={activeIndex === index}
                    onToggle={() => handleToggle(index)}
                    color={color}
                />
            ))}
        </div>
    );
};

export default BorderAccordion;