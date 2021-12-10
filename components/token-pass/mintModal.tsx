import Modal from '../layout/modal'

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
      <div>Hello, world.</div>
    </Modal>
  )
}

export default MintModal
