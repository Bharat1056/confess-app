
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function modal() {
  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader>
        <CardTitle>Share Your Feedback</CardTitle>
        <CardDescription>We value your input and would love to hear your thoughts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea className="resize-none" placeholder="Enter your feedback here..." rows={5} />
        <div className="flex justify-center">
          <Button>Send Feedback</Button>
        </div>
      </CardContent>
    </Card>
  )
}
