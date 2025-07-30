import { motion } from "framer-motion";
import { FiEdit3, FiTrash2, FiMapPin, FiHome, FiBriefcase, FiStar } from "react-icons/fi";
import BoopWrapper from "@/components/ui/BoopWrapper";

interface SavedLocation {
    id: string;
    name: string;
    address: string;
    zip: string;
    notes?: string;
    category?: 'home' | 'work' | 'other';
    isDefault?: boolean;
    createdAt: string;
}

interface SavedLocationCardProps {
    location: SavedLocation;
    onSelect: (location: SavedLocation) => void;
    onEdit: (location: SavedLocation) => void;
    onDelete: (location: SavedLocation) => void;
    onSetDefault?: (location: SavedLocation) => void;
    isDefault?: boolean;
}

export default function SavedLocationCard({
    location,
    onSelect,
    onEdit,
    onDelete,
    onSetDefault,
    isDefault
}: SavedLocationCardProps) {
    const getCategoryIcon = (category?: string) => {
        switch (category) {
            case 'home':
                return <FiHome className="h-4 w-4 text-blue-500" />;
            case 'work':
                return <FiBriefcase className="h-4 w-4 text-green-500" />;
            default:
                return <FiMapPin className="h-4 w-4 text-pink-500" />;
        }
    };

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'home':
                return 'text-blue-600 dark:text-blue-400';
            case 'work':
                return 'text-green-600 dark:text-green-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center"
        >
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                    {getCategoryIcon(location.category)}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{location.name}</h3>
                    {location.isDefault && (
                        <FiStar className="h-4 w-4 text-yellow-500" title="Default location" />
                    )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{location.address}</p>
                {location.zip && <p className="text-xs text-gray-500 dark:text-gray-400">ZIP: {location.zip}</p>}
                {location.notes && (
                    <p className="text-xs mt-1 italic text-gray-500 dark:text-gray-400">{location.notes}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${getCategoryColor(location.category)}`}>
                        {location.category || 'other'}
                    </span>
                    {location.isDefault && (
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300">
                            Default
                        </span>
                    )}
                </div>
            </div>
            <div className="flex gap-2 ml-4">
                <BoopWrapper>
                    <button
                        onClick={() => onSelect(location)}
                        className="text-pink-500 hover:text-pink-600 font-medium text-sm px-3 py-1 rounded hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                    >
                        Use
                    </button>
                </BoopWrapper>
                {onSetDefault && !isDefault && (
                    <BoopWrapper>
                        <button
                            onClick={() => onSetDefault(location)}
                            className="text-yellow-500 hover:text-yellow-600 font-medium text-sm px-3 py-1 rounded hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                            title="Set as default"
                        >
                            Set Default
                        </button>
                    </BoopWrapper>
                )}
                <BoopWrapper>
                    <button
                        onClick={() => onEdit(location)}
                        className="text-yellow-500 hover:text-yellow-600 p-1 rounded hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                    >
                        <FiEdit3 className="h-4 w-4" />
                    </button>
                </BoopWrapper>
                <BoopWrapper>
                    <button
                        onClick={() => onDelete(location)}
                        className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <FiTrash2 className="h-4 w-4" />
                    </button>
                </BoopWrapper>
            </div>
        </motion.div>
    );
} 