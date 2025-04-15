import { cn } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';
interface DateFormatProps {
    value: string;
    className?: string;
    status?: string;
}

const DateFormat = ({ value, className, status }: DateFormatProps) => {
    const today = new Date();
    const dueDate = new Date(value);
    const daysLeft = differenceInDays(dueDate, today);

    let textColor = 'text-muted-foreground';
    if (status !== 'done') {
        if (daysLeft <= 3) {
            textColor = 'text-red-500'; // Red for 3 days or less
        } else if (daysLeft <= 7) {
            textColor = 'text-orange-500'; // Orange for 4 to 7 days
        } else if (daysLeft <= 14) {
            textColor = 'text-yellow-500'; // Yellow for 8 to 14 days
        }
    }

    return (
        <div className={textColor}>
            <span className={cn('truncate', className)}>{format(value, 'PPP')}</span>
        </div>
    );
};

export default DateFormat;
