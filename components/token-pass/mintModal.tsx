import Modal from '../layout/modal'
import MintForm from './mintForm'

interface IProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

const MintModal: React.FC<IProps> = ({ isOpen, setIsOpen }) => {
  const closeModal = () => {
    setIsOpen(false)
  }
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <MintForm />
    </Modal>
  )
}

export default MintModal
