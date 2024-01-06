import { ComponentProps, useState, useEffect } from 'react'; // Import useState and useEffect
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail } from '@/app/mail/data';
import { useMail } from '@/app/use-mail';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface MailListProps {
  items: Mail[];
}

function CustomIcon() {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      onClick={() => {
        console.log('Icon clicked!');
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      style={{
        cursor: 'pointer',
        backgroundColor: isHovered ? '#d4d4d4' : 'transparent',
        padding: '5px',
        borderRadius: '0', // Set the border-radius to 0 to make the shadow square
        boxShadow: isHovered
          ? '0 0 5px rgba(0, 0, 0, 0.3)' // Adjust the shadow properties as needed
          : 'none',
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill={isHovered ? '#000000' : 'currentColor'}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail();
  const [mailItems, setMailItems] = useState(items); // State for managing items

  useEffect(() => {
    setMailItems(items); // Update mailItems when 'items' prop changes
  }, [items]);

  const deleteItem = (itemId: string) => {
    const updatedItems = mailItems.filter((item) => item.id !== itemId);
    setMailItems(updatedItems); // Update items state

    // Reset selected if the deleted item was selected
    setMail({
      ...mail,
      selected: mail.selected === itemId ? null : mail.selected,
    });
  };

  const moveItemToSolved = (itemId: string) => {
    const updatedItems = mailItems.map((item) => {
      if (item.id === itemId) {
        // Update 'read' property to mark the email as read
        return {
          ...item,
          read: true, // Set 'read' to true since it's marked as solved
        };
      }
      return item;
    });
  
    setMailItems(updatedItems);
  
    setMail({
      ...mail,
      selected: mail.selected === itemId ? null : mail.selected,
    });
  };
  
  
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {mailItems.map((item) => (
          <div key={item.id}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={`item-${item.id}`}>
                <AccordionTrigger>
                  <button
                    className={cn(
                      'relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
                      mail.selected === item.id && 'bg-muted'
                    )}
                    onClick={() =>
                      setMail({
                        ...mail,
                        selected: item.id,
                      })
                    }
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">{item.name}</div>
                          {!item.read && (
                            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <div
                          className={cn(
                            'ml-auto text-xs',
                            mail.selected === item.id
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          )}
                        >
                          {formatDistanceToNow(new Date(item.date), {
                            addSuffix: true,
                          })}
                        </div>
                        <div className="top-3 right-3">
                      <div className="px-2"
                    onClick={() =>
                      moveItemToSolved(item.id)
                    }>
                      <CustomIcon/>
                      </div>
                    </div>
                      </div>
                      <div className="text-xs font-medium">{item.subject}</div>
                    </div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {item.text.substring(0, 300)}
                    </div>

                  </button>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-xs text-muted-foreground">
                    {item.text}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>['variant'] {
  if (['work'].includes(label.toLowerCase())) {
    return 'default';
  }

  if (['personal'].includes(label.toLowerCase())) {
    return 'outline';
  }

  return 'secondary';
}
