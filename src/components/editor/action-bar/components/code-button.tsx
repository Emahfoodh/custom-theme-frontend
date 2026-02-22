import { TooltipWrapper } from '@/components/tooltip-wrapper';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileOutput } from 'lucide-react';

type CodeButtonProps = React.ComponentProps<typeof Button>;

export function CodeButton({ className, ...props }: CodeButtonProps) {
  return (
    <TooltipWrapper label="Export theme" asChild>
      <Button variant="ghost" size="sm" className={cn(className)} {...props}>
        <FileOutput className="size-3.5" />
        <span className="hidden text-sm md:block">Export</span>
      </Button>
    </TooltipWrapper>
  );
}
