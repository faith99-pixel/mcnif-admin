import { FunctionComponent, ReactElement, useCallback, useState } from "react";
import { IComboBoxOption, ComboBox, IComboBoxStyles, IComboBox } from "@fluentui/react";
import Label from "../ui/label";
import { BuffetSessionRequest } from "@/app/models/IBuffet";
import Input from "../ui/input";
import moment from "moment";

interface BuffetSessionProps {
    session: BuffetSessionRequest;
    index: number;
    handleInputChange: (index: number, field: 'startTime' | 'endTime' | 'slots', value: string | number) => void;
    sessionErrorMessages: {
        [key: number]: {
            startTime?: string;
            endTime?: string;
            slots?: string;
        };
    };
}


const comboBoxStyles: Partial<IComboBoxStyles> = {
    optionsContainerWrapper: {
        height: '50vh',
        // width: '100px'
    },
    root: {
        width: '120px',
        borderRadius: '12px',
        outline: 'none',
        fontSize: '12px'
    },

};

const BuffetSession: FunctionComponent<BuffetSessionProps> = ({ session, index, handleInputChange, sessionErrorMessages }): ReactElement => {
    const [startTime, setStartTime] = useState<string>(session.startTime);
    const [endTime, setEndTime] = useState<string>(session.endTime);

    /**
     * 
     * @returns generateTimeOptions: Generates an array of time options in 30-minute intervals.
     * startTime.setHours: Sets the start time to 10:00 AM
     * endTime.setHours: Sets the end time to 11:00 PM.
     * while (startTime <= endTime): Loops through every 30 minutes from 10:00 AM to 11:00 PM, adding each time as an option in the ComboBox
     * timeStr: Converts the date object to a human-readable time string (e.g., "10:00 AM")
     */
    const generateTimeOptions = (): IComboBoxOption[] => {
        const times: IComboBoxOption[] = [];
        const startTime = new Date();
        startTime.setHours(10, 0); // 10:00 AM

        const endTime = new Date();
        endTime.setHours(23, 0); // 11:00 PM

        while (startTime <= endTime) {
            const timeStr = moment(startTime).format('hh:mm A');
            // const timeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            times.push({ key: timeStr, text: timeStr });
            startTime.setMinutes(startTime.getMinutes() + 30); // Increment by 30 minutes
        }

        return times;
    };

    const onStartTimeChange = useCallback((event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
        if (option) {
            setStartTime(option.key as string);
            handleInputChange(index, 'startTime', option.key as string);
        }
    }, [handleInputChange, index]);

    const onEndTimeChange = useCallback((event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
        if (option) {
            setEndTime(option.key as string);
            handleInputChange(index, 'endTime', option.key as string);
        }
    }, [handleInputChange, index]);

    return (
        <div className='w-full flex items-center gap-4 mb-4'>
            <div className='flex flex-col'>
                <Label text={<>Start Time</>} className='mcNiff-primary-dark-4 mb-1' />
                <ComboBox
                    placeholder="Start Time"
                    selectedKey={startTime}
                    options={generateTimeOptions()}
                    styles={comboBoxStyles}
                    onChange={onStartTimeChange}
                />
                {sessionErrorMessages[index]?.startTime && <p className="text-error text-xs mt-1">{sessionErrorMessages[index].startTime}</p>}
            </div>

            <div className='flex flex-col mx-4'>
                <Label text={<>End Time</>} className='mcNiff-primary-dark-4 mb-1' />
                <ComboBox
                    placeholder="End Time"
                    selectedKey={endTime}
                    options={generateTimeOptions()}
                    styles={comboBoxStyles}
                    onChange={onEndTimeChange}
                />
                {sessionErrorMessages[index]?.endTime && <p className="text-error text-xs mt-1">{sessionErrorMessages[index].endTime}</p>}
            </div>

            <div className='flex flex-col'>
                <Label text={<>Slots</>} className='mcNiff-primary-dark-4 mb-1' />
                <Input
                    placeholder='Slots'
                    className='py-2 !px-2 rounded-lg placeholder:!text-mcNiff-light-gray-3'
                    value={session.slots}
                    onChange={(e) => {
                        const value = e.target.value;
                        const numericValue = Number(value);

                        // Check if the value is empty or a valid number
                        if (value === '' || !isNaN(numericValue)) {
                            handleInputChange(index, 'slots', value === '' ? 0 : numericValue);
                        }
                    }}
                />
                {sessionErrorMessages[index]?.slots && <p className="text-error text-xs mt-1">{sessionErrorMessages[index].slots}</p>}
            </div>
        </div>
    );
}

export default BuffetSession;
