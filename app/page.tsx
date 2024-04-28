import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <Card className="max-w-[30rem] w-4/5 min-w-[15rem]">
      <CardHeader>
        <CardTitle>Bad image storing ideas</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {`This website serves as a fun way to demonstrate different ways of
          managing images uploaded by users without actually storing them
          server-side.`}
        </CardDescription>
        <Separator className="opacity-25 my-6" />
        <CardDescription>
          {`Test out the different methods by visiting them at the top. While the
          images uploaded are not stored on the server, do be weary about what
          you upload since this is a random website on the web after all. In
          case you're sceptical, you can always check the network tab to see if
          any of the images you upload are sent anywhere.`}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
