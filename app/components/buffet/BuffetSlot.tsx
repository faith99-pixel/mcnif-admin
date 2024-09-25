// import { ReactElement, FunctionComponent } from "react";
// import Label from "../ui/label";
// import Input from "../ui/input";
// import { BuffetSessionRequest } from "@/app/models/IBuffet";

// interface BuffetSlotProps {
//     slotPeriod: string;
//     index: number
//     handleInputChange: (index: number, field: string, value: string) => void
//     // sessionErrorMessages: Record<number, string | boolean>
//     sessionErrorMessages: {
//         [key: number]: {
//             startTime?: string;
//             endTime?: string;
//             slots?: string;
//         };
//     }

// }

// const BuffetSlot: FunctionComponent<BuffetSlotProps> = ({ slotPeriod, index, handleInputChange, sessionErrorMessages }): ReactElement => {
//     return (
//         <div className='flex flex-col gap-1'>
//             <Label
//                 text={<>{slotPeriod}</>}
//                 className='mcNiff-primary-dark-4'
//             />
//             <Input
//                 placeholder='How many slots available?'
//                 className=' py-2 !px-2 rounded-lg placeholder:!text-mcNiff-light-gray-3'
//                 // value={sessionData.slots}
//                 onChange={(e) => handleInputChange(index, 'slots', e.target.value)}
//             />
//             {/* {sessionErrorMessages && sessionErrorMessages[index] && <span className='text-error text-sm'>{sessionErrorMessages[index]}</span>} */}
//             {sessionErrorMessages[index]?.slots && <p className="text-error">{sessionErrorMessages[index].slots}</p>}
//         </div>
//     );
// }

// export default BuffetSlot;