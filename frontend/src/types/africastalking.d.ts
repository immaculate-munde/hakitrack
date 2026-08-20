declare module "africastalking" {
  type AfricasTalkingClient = {
    SMS: {
      send(options: {
        to: string[];
        message: string;
        from?: string;
      }): Promise<unknown>;
    };
  };

  export default function AfricasTalking(credentials: {
    apiKey: string;
    username: string;
  }): AfricasTalkingClient;
}
