declare module "africastalking" {
  type SmsRecipient = {
    status?: string;
    number?: string;
    cost?: string;
    messageId?: string;
  };

  type SmsSendResponse = {
    SMSMessageData?: {
      Message?: string;
      Recipients?: SmsRecipient[];
    };
  };

  type AfricasTalkingClient = {
    SMS: {
      send(options: {
        to: string[];
        message: string;
        from?: string;
      }): Promise<SmsSendResponse>;
    };
  };

  export default function AfricasTalking(credentials: {
    apiKey: string;
    username: string;
  }): AfricasTalkingClient;
}
