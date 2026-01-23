import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
export function PinPad({
  onSubmit,
  onCancel,
  userName
}) {
  const [pin, setPin] = useState('');
  const handleNumberClick = num => {
    if (pin.length < 6) {
      setPin(pin + num);
    }
  };
  const handleClear = () => {
    setPin('');
  };
  const handleSubmit = () => {
    if (pin.length >= 4) {
      onSubmit(pin);
    }
  };
  return <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Enter PIN</CardTitle>
            <CardDescription>{userName}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-12 w-12 rounded-lg border-2 flex items-center justify-center">
              {pin[i] && <div className="h-3 w-3 rounded-full bg-primary" />}
            </div>)}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => <Button key={num} variant="outline" size="lg" onClick={() => handleNumberClick(num.toString())} className="h-16 text-xl">
              {num}
            </Button>)}
          <Button variant="outline" size="lg" onClick={handleClear} className="h-16">
            Clear
          </Button>
          <Button variant="outline" size="lg" onClick={() => handleNumberClick('0')} className="h-16 text-xl">
            0
          </Button>
          <Button variant="default" size="lg" onClick={handleSubmit} className="h-16" disabled={pin.length < 4}>
            Enter
          </Button>
        </div>
      </CardContent>
    </Card>;
}